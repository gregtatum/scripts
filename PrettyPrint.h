#ifndef PrettyPrint_h_
#define PrettyPrint_h_

#include <string_view>
#include <iostream>
#include "mozilla/Utf8.h"
#include "mozilla/Span.h"

static void OutputUTF8(mozilla::Span<const char> data) {
  std::cout << "\"";
  for (size_t i = 0; i < data.Length(); i++) {
    auto ch = data.begin()[i];
    switch (ch) {
      case '\0':
        std::cout << "\\0";
        break;
      case '"':
        std::cout << "\\\"";
        break;
      default:
        std::cout << ch;
    }
  }
  std::cout << "\"";
}

void PrettyPrint(std::basic_string_view<const char> string,
                 const char* msg = "") {
  std::cout << msg << "std::basic_string_view<const char> {\n  Length: "
            << string.length() << " bytes,\n  String: ";
  OutputUTF8(string);
  std::cout << ",\n  NullTerminated: ";
  if (string.begin()[string.length() - 1] == '\0') {
    std::cout << "inside of span";
  } else if (string.begin()[string.length()] == '\0') {
    std::cout << "outside of span";
  } else {
    std::cout << "no";
  }

  std::cout << ",\n}\n";
}

static std::string ToUtf8(mozilla::Span<const char16_t> input) {
  size_t buff_len = input.Length() * 3;
  std::string result(buff_len, ' ');
  result.reserve(buff_len);
  size_t result_len =
      ConvertUtf16toUtf8(input, mozilla::Span(result.data(), buff_len));
  result.resize(result_len);
  return result;
}

void PrettyPrint(mozilla::Span<const char16_t> string, const char* msg = "",
                 const char* typeName = "mozilla::Span<const char16_t>") {
  std::cout << msg << typeName << " {\n  Length: " << string.Length()
            << " characters,\n  String: ";

  OutputUTF8(ToUtf8(string));
  std::cout << ",\n  NullTerminated: ";
  if (string.begin()[string.Length() - 1] == '\0') {
    std::cout << "inside of span";
  } else if (
      // Check for the value 0x0000
      reinterpret_cast<const char*>(string.data())[string.Length() * 2] ==
          '\0' &&
      reinterpret_cast<const char*>(string.data())[string.Length() * 2 + 1] ==
          '\0') {
    std::cout << "outside of span";
  } else {
    std::cout << "no";
  }

  std::cout << ",\n}\n";
}

void PrettyPrint(
    std::basic_string_view<const char16_t> string, const char* msg = "",
    const char* typeName = "std::basic_string_view<const char16_t>") {
  PrettyPrint(mozilla::Span(string), msg, typeName);
}

#endif
